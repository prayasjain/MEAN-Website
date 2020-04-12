import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn : 'root'})
export class PostsService {

  constructor( private http : HttpClient, private router : Router) {}

  private posts : Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    this.http
    .get<{message : string, posts : any}>('http://localhost:3000/api/posts')
    .pipe(map(postData => {
      return postData.posts.map((post) => {
        return {
          id: post._id,
          title: post.title,
          content: post.content
        };
      });
    }))
    .subscribe( (postData) => {
      this.posts = postData;
      this.postsUpdated.next([...this.posts]);
    });
  }

  getPost(postId : string) {
    return this.http.get<{_id: string, title: string, content: string}>
      ('http://localhost:3000/api/posts/' + postId);
  }

  updatePost(id: string, title : string, content: string) {
    const post : Post = {
      id : id,
      title: title,
      content: content
    };
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => {
      const updatePosts = [...this.posts];
      const postIndex = updatePosts.findIndex(p => p.id === post.id);
      updatePosts[postIndex] = post;
      this.posts = updatePosts;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    })
  }

  deletePost(postId : String) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title : String, content : String) {
    const post : Post = {id : null, title : title, content : content};
    this.http.post<{message : string, postId : string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
