var express = require('express');
var router = express.Router();
var pool=require('./pool')
var upload=require('./multer')

/* GET home page. */
router.get('/ticket_interface', function(req, res, next) {
  res.render('ticketinterface', { message:''});
});

router.post('/movie_submit',upload.single("movieposter"), function(req, res, next) {
  try
  {
    console.log("DATA:",req.body)
    console.log("FILE:",req.file)
pool.query("insert into movies(stateid, cityid, cinemaid, screenid, moviename, description, status, movieposter) values(?,?,?,?,?,?,?,?)",[req.body.stateid, req.body.cityid, req.body.cinemaid, req.body.screenid, req.body.moviename, req.body.description, req.body.status, req.file.filename],function(error,result){
  if(error)
  {
    console.log("D ERROR", error);
    res.render('ticketinterface', { message:'Database Error'});
  }
  else
  {
   
      res.render('ticketinterface', { message:'Details Submitted Succesfully'});
  }
})
  }

  catch(e)
  {
    console.log("Error:",e)
    res.render('ticketinterface', { message:'Server Error'});
  }

 
});

router.get('/fetch_state', function(req, res, next) {
  try
  {
    
pool.query("select * from state",function(error,result){
  if(error)
  {
    console.log("D ERROR", error);
    res.status(200).json([])
  }
  else
  {
    res.status(200).json({result:result})   
  }
})
  }

  catch(e)
  {
    console.log("Error:",e)
    res.render('ticketinterface', { message:'Server Error'});
  }

 
});

router.get('/fetch_city', function(req, res, next) {
  try
  {
    
pool.query("select * from city where stateid=?",[req.query.stateid],function(error,result){
  if(error)
  {
    console.log("D ERROR", error);
    res.status(200).json([])
  }
  else
  {
    res.status(200).json({result:result})   
  }
})
  }

  catch(e)
  {
    console.log("Error:",e)
    res.render('ticketinterface', { message:'Server Error'});
  }

 
});

router.get('/fetch_cinema', function(req, res, next) {
  try
  {
    
pool.query("select * from cinema",function(error,result){
  if(error)
  {
    console.log("D ERROR", error);
    res.status(200).json([])
  }
  else
  {
    res.status(200).json({result:result})   
  }
})
  }

  catch(e)
  {
    console.log("Error:",e)
    res.render('ticketinterface', { message:'Server Error'});
  }

 
});

router.get('/fetch_screen', function(req, res, next) {
  try
  {
    
pool.query("select * from screen where cinemaid=?",[req.query.cinemaid],function(error,result){
  if(error)
  {
    console.log("D ERROR", error);
    res.status(200).json([])
  }
  else
  {
    res.status(200).json({result:result})   
  }
})
  }

  catch(e)
  {
    console.log("Error:",e)
    res.render('ticketinterface', { message:'Server Error'});
  }

 
});

router.get('/fetch_all_movies', function(req, res, next) {
  try
  {
  pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid) as statename,(select C.cityname from city C where C.cityid=M.cityid) as cityname,(select CN.cinemaname from cinema CN where CN.cinemaid=M.cinemaid) as cinemaname,(select SC.Screenname from screen SC where SC.screenid=M.screenid) as screenname from movies M",function(error,result){
  if(error)
  {
    console.log("D ERROR", error);
    res.render("displayallmovies",{data:[], message:"Database Error"});
  }
  else
  {
    res.render("displayallmovies",{data:result, message:"success"});   
  }
})
  }

  catch(e)
  {
    console.log("Error:",e)
    res.render("displayallmovies",{data:[], message:'Server Error' });

  }

 
});


router.get('/displayforedit', function(req, res, next) {
  try
  {
  pool.query("select M.*,(select S.statename from state S where S.stateid=M.stateid) as statename,(select C.cityname from city C where C.cityid=M.cityid) as cityname,(select CN.cinemaname from cinema CN where CN.cinemaid=M.cinemaid) as cinemaname,(select SC.Screenname from screen SC where SC.screenid=M.screenid) as screenname from movies M where M.movieid=?",[req.query.movieid],function(error,result){
  if(error)
  {
    console.log("D ERROR", error);
    res.render("displayforedit",{data:[], message:"Database Error"});
  }
  else
  {
    res.render("displayforedit",{data:result[0], message:"success"});   
  }
})
  }

  catch(e)
  {
    console.log("Error:",e)
    res.render("displayforedit",{data:[], message:'Server Error' });

  }

 
});


router.post('/edit_movie',function(req,res){

  try{
  if(req.body.btn=="Edit")
   pool.query("update movies set stateid=?, cityid=?, cinemaid=?, screenid=?, description=?, status=?, moviename=? where movieid=?",[req.body.stateid, req.body.cityid, req.body.cinemaid, req.body.screenid, req.body.description, req.body.status, req.body.moviename, req.body.movieid],function(error,result){

    if(error)
    {console.log("D ERROR", error);
      res.redirect('/ticket/fetch_all_movies')
   }

    else
    {
      res.redirect('/ticket/fetch_all_movies')
    }
   }
   );
   else
   {
    pool.query("delete from movies where movieid=?",[req.body.movieid],function(error,result){

      if(error)
      {console.log("D ERROR", error);
        res.redirect('/ticket/fetch_all_movies')
     }
  
      else
      {
        res.redirect('/ticket/fetch_all_movies')
      }
     }
     );
   }
  }
  catch(e)
  {console.log("Error:",e)
  res.redirect('/ticket/fetch_all_movies')
  
  }

})

router.get('/displaypictureforedit', function(req, res, next) {
  res.render("displaypictureforedit",{data:req.query})
  
  })
  

router.post('/edit_poster',upload.single('movieposter'),function(req,res){

  try{
  
   pool.query("update movies set movieposter=?, where movieid=?",[req.file.filename,req.body.movieid],function(error,result){

    if(error)
    {console.log("D ERROR", error);
      res.redirect('/ticket/fetch_all_movies')
   }

    else
    {
      
      res.redirect('/ticket/fetch_all_movies')
    }
   }
   );
   
   
  }
  catch(e)
  {console.log("Error:",e)
  res.redirect('/ticket/fetch_all_movies')
  
  }

})



module.exports = router;
