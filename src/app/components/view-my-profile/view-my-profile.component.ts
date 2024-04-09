import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { StorageService } from '../../_services/storage.service';
import { UserService } from '../../_services/user.service';
import { Component } from '@angular/core';
import { ViewUser } from '../../_helpers/app-user';

@Component({
  selector: 'app-view-my-profile',
  templateUrl: './view-my-profile.component.html',
  styleUrls: ['./view-my-profile.component.css'],
})
export class ViewMyProfileComponent {
  constructor(
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  userProfile: ViewUser | null = null;
  admin: boolean = false;
  strRoles: string = '';
  message: string = '';
  id: number = -1;
  pathId: string | null = '';

  ngOnInit(): void {
    this.admin = this.storageService.isAdmin();

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.pathId = params.get('id');
    });

    if (this.isValidPathId()) {
      this.userService.viewProfile(this.id).subscribe({
        next: (data) => {
          this.userProfile = data;
          this.userProfile.role.join(', ');
        },
        error: (err) => {
          this.message = err.error.message;
          // window.alert([this.message]);
          this.router.navigate(['/not-found']);
          if (err.error) {
            // this.content = JSON.parse(err.error).message;
          } else {
            // this.message = 'Error with status: ' + err.status;
          }
        },
      });
    } else {
      this.router.navigate(['/not-found']);
    }
  }

  isValidPathId(): boolean {
    if (this.pathId && Number.isInteger(this.id = Number.parseInt(this.pathId))) {
      if (this.id > 0) {
        return true;
      }
    }

    return false;
  }
}