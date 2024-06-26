import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ContractService } from 'src/app/_services/contract.service';
import { StorageService } from 'src/app/_services/storage.service';
import { ViewContract } from 'src/app/_helpers/contract';
import { Component } from '@angular/core';

@Component({
  selector: 'app-view-contract-notary',
  templateUrl: './view-contract-notary.component.html',
  styleUrls: ['./view-contract-notary.component.css']
})
export class ViewContractNotaryComponent {
  constructor(
    private contractService: ContractService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  notary: boolean = false;
  pathId: string | null = '';
  contractId: number = -1;
  message: string = '';

  contract: ViewContract = {
    text: '',
    dateCreated: '',
    dateApproved: '',
    status: '',
    members: [
      {"answer": '', "fullName": ''},
      {"answer": '', "fullName": ''},
      {"answer": '', "fullName": ''},
      {"answer": '', "fullName": ''}
    ],
  };

  ngOnInit(): void {
    this.notary = this.storageService.isNotary();

    if (this.notary) {
      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.pathId = params.get('id');
      });
      
      if (this.isValidPathId()) {
        this.contractService.viewContractNotary(this.contractId).subscribe({
          next: (data) => {
            this.contract = data;
          },
          error: (err) => {
            console.log(err)
            this.router.navigate(['/not-found']);
          },
        });
      } else {
        this.router.navigate(['/not-found']);
      }
    } else {
      this.router.navigate(['/not-found']);
    }
  }

  isValidPathId(): boolean {
    if (this.pathId && Number.isInteger(this.contractId = Number.parseInt(this.pathId))) {
      if (this.contractId > 0) {
        return true;
      }
    }

    return false;
  }

  approveContract(): void {
    this.contractService.approveContractNotary(this.contractId).subscribe({
      next: (data) => {
        window.location.reload();
      },
      error: (err) => {
        this.message = err.error.message;
        console.log(this.message);
        // this.router.navigate(['/home']);
        // window.alert([this.message]);
        if (err.error) {
          // this.content = JSON.parse(err.error).message;
        } else {
          this.message = 'Error with status: ' + err.status;
        }
      },
    });
  }

}
