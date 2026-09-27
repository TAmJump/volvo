export class VehicleLocationConnector {
  constructor(config={}) { this.config=config; }
  async capabilities(){ return []; }
  async fetchLatestLocation(){ throw new Error('Not implemented'); }
}
export function requireServerSecret(name){
  const v=process.env[name]; if(!v) throw new Error(`Missing secret: ${name}`); return v;
}
