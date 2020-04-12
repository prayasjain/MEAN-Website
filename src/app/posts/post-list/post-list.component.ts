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

  constructor(public postsService : PostsService) { }

  ngOnInit() {
    this.postsService.getPosts();
    this.postSub = this.postsService.getPostUpdateListener()
    .subscribe((posts : Post[])=> {
      this.postsStored = posts;
    });
  }
  2l0z4VGrN2KmQXZR
  ngOnDestroy() {
    this.postSub.unsubscribe();
  }
}
