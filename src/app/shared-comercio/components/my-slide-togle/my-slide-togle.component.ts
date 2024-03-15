import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-my-slide-togle',
    templateUrl: './my-slide-togle.component.html',
    styleUrls: ['./my-slide-togle.component.css']
})
export class MySlideTogleComponent implements OnInit {
    @Input() inputBoolean = false;
    @Input() dis = true;
    @Input() txtTitulo!: string;
    @Input() txtTrue!: string;
    @Input() txtFalse!: string;
    @Output() outputBolean: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {
    }

    ngOnInit(): void {
    }

    changeChecked(): void {
        this.inputBoolean = !this.inputBoolean;
        this.outputBolean.emit(this.inputBoolean);
    }

}
