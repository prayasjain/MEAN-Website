import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService} from '../posts.service';
import { Subscription} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector : 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls : [ './post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  postsStored : Post[] = [];
  private postSub : Subscription;
  private authStatusSub : Subscription;
  public isAuthenticated = false;
  isLoading = false;
  userId : string;
  totalPosts = 1;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];

  constructor(public postsService : PostsService, private authService : AuthService) { }

  ngOnInit() {

    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe( (postData : {posts : Post[], maxPosts: number})=> {
      this.isLoading = false;
      this.postsStored = postData.posts;
      this.totalPosts = postData.maxPosts;
      if (this.totalPosts > 0 && this.postsStored.length ==0) {
        this.currentPage-=1;
        this.isLoading = true;
        this.postsService.getPosts(this.postPerPage, this.currentPage);
      }

    });
    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
    console.log(this.userId);
  }

  onDelete(postId : string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(response => {
        this.postsService.getPosts(this.postPerPage, this.currentPage);
      }, error => {
        this.isLoading = false;
      });

  }

  onChangePage(pageEvent : PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.postPerPage = pageEvent.pageSize;
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
