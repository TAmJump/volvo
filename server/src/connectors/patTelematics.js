import {VehicleLocationConnector,requireServerSecret} from './base.js';
export class PatTelematicsConnector extends VehicleLocationConnector {
 async capabilities(){return ['latest_location'];}
 async fetchLatestLocation(vehicle){
  const base=requireServerSecret('TELEMATICS_BASE_URL');
  const pat=requireServerSecret('TELEMATICS_PAT');
  const r=await fetch(`${base}/vehicles/${encodeURIComponent(vehicle.providerVehicleId)}/location`,{headers:{Authorization:`Bearer ${pat}`,Accept:'application/json'}});
  if(!r.ok) throw new Error(`Provider error ${r.status}`);
  const x=await r.json();
  return {source_type:'TELEMATICS',source_provider:vehicle.provider,observed_at:x.observed_at,lat:x.lat,lon:x.lon,accuracy_m:x.accuracy_m??null,confidence:1,raw:x};
 }
}
