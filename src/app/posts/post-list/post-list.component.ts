import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService} from '../posts.service';
import { Subscription} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector : 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls : [ './post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  postsStored : Post[] = [];
  private postSub : Subscription;
  isLoading = false;
  totalPosts = 1;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];

  constructor(public postsService : PostsService) { }

  ngOnInit() {

    this.isLoading = true;
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
  }

  onDelete(postId : string) {
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe(response => {
        this.postsService.getPosts(this.postPerPage, this.currentPage);
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
  }
}
