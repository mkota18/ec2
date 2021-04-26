import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(private httpclient:HttpClient) { }
  getComments(data): Observable<any>{
    return this.httpclient.post('http://3.143.200.29/awsAutomation',data);

  }
  newupdate(){
    let change = {"upgrade":"update"}
    return this.httpclient.post('http://3.143.33.7:3000/update/clone',change);
  }
}
