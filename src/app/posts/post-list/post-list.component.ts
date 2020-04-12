import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService} from '../posts.service';
import { Subscription} from 'rxjs';

@Component({
  selector : 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls : [ './post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{

  postsStored : Post[] = [];
  private postSub : Subscription;
  isLoading = false;

  constructor(public postsService : PostsService) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.isLoading = true;
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((posts : Post[])=> {
      this.isLoading = false;
      this.postsStored = posts;
    });
  }

  onDelete(postId : string) {
    this.postsService.deletePost(postId);

  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
