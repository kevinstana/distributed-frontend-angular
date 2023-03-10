import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserContract } from '../_helpers/contract';
import { ContractService } from '../_services/contract.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-view-contract-notary',
  templateUrl: './view-contract-notary.component.html',
  styleUrls: ['./view-contract-notary.component.css'],
})
export class ViewContractNotaryComponent {
  isLoggedIn = false;
  isNotary = false;
  message = '';
  contractId?: number;

  contract: UserContract = {
    text: '',
    dateCreated: '',
    dateApproved: '',
    status: '',
    members: [],
  };

  member1: string[] = [];
  member2: string[] = [];
  member3: string[] = [];
  member4: string[] = [];

  constructor(
    private storageService: StorageService,
    private contractService: ContractService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (!this.isLoggedIn) {
      this.router.navigateByUrl('/login');
    } else {
      this.isNotary = this.storageService.isNotary();
      if (!this.isNotary) {
        this.router.navigateByUrl('/home');
      } else {
        this.contractId = this.storageService.getContractId();
        if (this.contractId != -1) {
          this.contractService.viewContractNotary(this.contractId!).subscribe({
            next: (data) => {
              this.contract = data;
              this.member1 = this.contract.members[0].split(': ');
              this.member2 = this.contract.members[1].split(': ');
              this.member3 = this.contract.members[2].split(': ');
              this.member4 = this.contract.members[3].split(': ');
            },
            error: (err) => {
              this.message = err.error.message;
              // window.alert([this.message]);
              this.router.navigate(['/home']);
              if (err.error) {
                // this.content = JSON.parse(err.error).message;
              } else {
                this.message = 'Error with status: ' + err.status;
              }
            },
          });
        } else {
          this.router.navigate(['/contracts']);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.storageService.removeContractId();
  }

  approveContract(contractId: number) {
    this.contractService.approveContractNotary(contractId).subscribe({
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
