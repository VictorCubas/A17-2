import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SessionService } from '../services/session.service';
import { SnackbarService } from '../services/snackbar-service.service';

@Component({
  selector: 'app-page-modules',
  templateUrl: './page-modules.component.html',
  styleUrls: ['./page-modules.component.scss']
})
export class PageModulesComponent implements OnInit {

  list!: any[];
  unsubscribe$: Subject<any> = new Subject();
  constructor(
    private router: Router,
    public sessionService: SessionService,
    private snackbar: SnackbarService,
  ) {
  }

  ngOnInit(): void {
    this.list = this.sessionService.getModulos();
  }

  goModule(e: any): void {
    // this.sessionService.getTokenModulo(e.id).pipe(takeUntil(this.unsubscribe$)).subscribe( resp => {
    //   this.snackbar.noMessage();
    //   this.sessionService.reemplazarTokenLocal(resp);
    //   this.sessionService.setModulo(e.modulo.toLowerCase());
    // });
    this.router.navigate([e.modulo.toLowerCase()]);
  }

}
