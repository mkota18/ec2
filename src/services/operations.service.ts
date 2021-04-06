import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(private httpclient:HttpClient) { }
  getComments(data): Observable<any>{
    return this.httpclient.post('http://localhost:3000/awsAutomation',data);

  }

  callNodeJsExecuter(command){
    let data = {"commands":command}
    return this.httpclient.post('http://localhost:3000/commandsexec',data);
  }
}