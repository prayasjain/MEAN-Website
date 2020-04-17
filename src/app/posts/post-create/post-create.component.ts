import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import {mimeType} from './mime-type.validator';

@Component({
  selector : 'app-post-create',
  templateUrl : './post-create.component.html',
  styleUrls : ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  private mode = 'create';
  private postId : string;
  public post : Post;
  form : FormGroup;
  imagePreview : string;
  isLoading = false;

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading=true;
    if (this.mode === 'create') {
      this.postsService.addPost(
        this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null,
        { validators: [Validators.required, Validators.minLength(3)],
          updateOn: 'change'
        }),
      'content': new FormControl(null,
        {validators: [Validators.required]}),
      'image': new FormControl(null,
        {validators: [Validators.required],
         asyncValidators: [mimeType]
        })
    });
    this.route.paramMap.subscribe((paramMap : ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((post) => {
          this.isLoading = false;
          this.post = {id: post._id, title: post.title,
            content: post.content, imagePath: post.imagePath, creator: post.creator};
          //must be for all
          this.form.setValue({'title': this.post.title, 'content': this.post.content,
            'image': this.post.imagePath});
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = null;
      }
    });
  }

  onImagePicked(event : Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

  }
  constructor(public postsService : PostsService, public route : ActivatedRoute) {}
}
