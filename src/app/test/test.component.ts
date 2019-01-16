import { Component, OnInit } from '@angular/core';
import { Test } from '../dto/Test';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public listaPlanillas: Test[];
  constructor() {
    this.listaPlanillas = [{ nombre: 'Jane' }, { nombre: 'John' }];
  }

  ngOnInit() {
  }

}
