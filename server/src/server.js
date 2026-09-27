import 'dotenv/config'; import express from 'express'; import helmet from 'helmet'; import crypto from 'crypto';
import {PatTelematicsConnector} from './connectors/patTelematics.js';
const app=express(); app.use(helmet()); app.use(express.json({limit:'1mb'})); app.use(express.static('public'));
const observations=[]; const cases=new Map();
function legalGate(req,res,next){const c=cases.get(req.params.id); if(!c||c.legal_basis_status!=='APPROVED') return res.status(403).json({error:'APPROVED legal basis required'}); next();}
app.post('/api/cases',(req,res)=>{const id=crypto.randomUUID(); cases.set(id,{id,...req.body,legal_basis_status:'PENDING'});res.status(201).json(cases.get(id));});
app.post('/api/cases/:id/legal-basis',(req,res)=>{const c=cases.get(req.params.id);if(!c)return res.sendStatus(404);c.legal_basis_status=req.body.status==='APPROVED'?'APPROVED':'PENDING';c.legal_basis=req.body;res.json(c);});
app.post('/api/cases/:id/connectors/pat/sync',legalGate,async(req,res)=>{try{const con=new PatTelematicsConnector();const o=await con.fetchLatestLocation(req.body.vehicle);const saved={id:crypto.randomUUID(),case_id:req.params.id,...o,received_at:new Date().toISOString()};observations.push(saved);res.json(saved);}catch(e){res.status(502).json({error:e.message});}});
app.post('/api/webhooks/gps',(req,res)=>{const secret=process.env.GPS_WEBHOOK_SECRET;if(!secret)return res.status(503).json({error:'webhook not configured'});const supplied=req.header('x-webhook-secret');if(supplied!==secret)return res.sendStatus(401);observations.push({id:crypto.randomUUID(),...req.body,source_type:'GPS',received_at:new Date().toISOString()});res.sendStatus(202);});
app.get('/api/cases/:id/last-location',(req,res)=>{const x=observations.filter(o=>o.case_id===req.params.id).sort((a,b)=>new Date(b.observed_at)-new Date(a.observed_at))[0];x?res.json(x):res.status(404).json({error:'No authorized observation'});});
app.get('/api/health',(req,res)=>res.json({ok:true,mode:'REAL_CONNECTOR_READY',secrets_in_browser:false}));
app.listen(process.env.PORT||8080,()=>console.log('TRACE VEHICLE listening'));
