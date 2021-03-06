const express=require('express');
const mongoose = require('mongoose');

const Score = require('../models/score.js');

mongoose.connect(`mongodb+srv://ricksdb-2:${process.env.PASS}@brother.bmzhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{
	useNewUrlParser: true,
	useUnifiedTopology: true
},()=>console.log('Database Connected..'));

const app=express();

mongoose.set('useFindAndModify', true);

app.get('/',(req,res)=>{
	res.sendFile('./public/index.html');
})
//..
app.get('/get/score',async(req,res)=>{
	try{
		const data = await Score.findById('609237090e782a0688f37212');
		res.send(data);
	}catch(err){
		console.log("error while geting value from file\n"+err);
	}
})

app.get('/get/high-score',async(req,res)=>{
	try{
		const {highScore} = await Score.findById('609237090e782a0688f37212');
		res.send({highScore});
	}catch(err){
		console.log("error while geting value from file(high score)\n"+err);
	}
})

app.post('/count/score',async(req,res)=>{
	try{
		let {count}=await Score.findById('609237090e782a0688f37212');
		count+=req.body.count;
		req.body.count=count;
		await Score.findByIdAndUpdate('609237090e782a0688f37212',req.body,{ useFindAndModify:true });
		res.sendStatus(200);
	}catch(err){
		console.log("error while updating counted value \n"+err);
	}

})

app.post('/count/high-score',async(req,res)=>{
	try{
		const {highScore} = await Score.findById('609237090e782a0688f37212');
		if(highScore < req.body.highScore){
			try{
				await Score.findByIdAndUpdate('609237090e782a0688f37212',req.body,{ useFindAndModify:true })
				res.sendStatus(200);
			}catch(err){
				console.log("error while updating High Score value \n"+err);
				res.sendStatus(409);
			}
		}
	}catch(err){
		console.log("error while geting (high score) for check(and update)\n"+err);
		res.sendStatus(409);
	}


})

module.exports=app;


function reset(){
	const data = new Score({
		count:0,
		highScore:0
	});
	fun(data);
}
async function fun(data){
	await data.save().then(e => {
		console.log("success    ::",e);
	}).catch(e=>{
		console.log(e);
	})
}
