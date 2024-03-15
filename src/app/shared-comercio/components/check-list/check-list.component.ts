import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BasicResponse } from 'app/_helpers/clases/basic-response';
import { MetodosServicio } from 'app/_helpers/interfaces/metodos-servicio';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
    selector: 'app-check-list',
    templateUrl: './check-list.component.html'
})
export class CheckListComponent<T> implements OnInit {
    @Input() inputBoolean = false;
    @Input() dis = true;
    @Input() field = '';
    /**
     * Servicio para recuperar el listado a ser renderizado con opción de check
     */
    @Input() service!: MetodosServicio<T>;
    @Output() outputBolean: EventEmitter<boolean> = new EventEmitter<boolean>();
    list!: Observable<Array<T>> | any;

    constructor() {
    }

    ngOnInit(): void {
        this.list = this.getList();
    }

    changeChecked(): void {
        this.inputBoolean = !this.inputBoolean;
        this.outputBolean.emit(this.inputBoolean);
    }

    getList(): any {
        return this.service.getList().pipe(map((res: BasicResponse<T[]>) => res.data));
    }

}
