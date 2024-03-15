import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from 'app/services/loader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  unsubscribe$: Subject<any> = new Subject();

  constructor(private loaderService: LoaderService, private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loaderService.isLoading.pipe(takeUntil(this.unsubscribe$)).subscribe((v) => {
      this.loading = v;
      this.ref.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(0);
    this.unsubscribe$.complete();
  }

}
