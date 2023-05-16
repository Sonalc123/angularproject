import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import Sortable from 'sortablejs';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit, AfterViewInit {
    users : any;
    direction : any='desc';
    @ViewChild('table') table: any;
    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
            }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id) 
            });
    }

    sort(value: any) {
        let sortedArray = (this.users || []).sort((a,b)=>{
            if(a[value] > b[value]){
              return 1;
            }
            if(a[value] < b[value]){
              return -1;
            }
            return 0;
          })
        this.users=sortedArray;
    }
    

    ngAfterViewInit() {
        new Sortable(this.table.nativeElement.getElementsByTagName('tbody')[0], {
          animation: 150, // Animation speed in milliseconds
          handle: '.drag-handle', // Selector for the drag handle element
          onEnd: (event) => {
            console.log('Moved item with id', event.item.getAttribute('data-id'));
          }
        });
      }
}