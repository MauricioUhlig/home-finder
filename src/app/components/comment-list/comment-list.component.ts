import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../models/comment.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule]
})
export class CommentListComponent implements OnInit {
  @Input() locationId!: number;
  comments: Comment[] = []; // Array to store comments
  commentForm: FormGroup; // Form for adding new comments
  user: any;

  constructor(private fb: FormBuilder, private dataService: DataService, private auth: AuthService) {
    this.commentForm = this.fb.group({
      commentText: ['', [Validators.required, Validators.minLength(1)]],
    });
    this.user = auth.getCurrentUser();
  }

  ngOnInit(): void {
    // Load initial comments (you can replace this with an API call)
    this.loadComments();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['locationId']) {
      this.loadComments();
    }
  }

  // Load initial comments (mock data)
  async loadComments() {
    let commtens = await this.dataService.getCommentsByLocationId(this.locationId);
    if (commtens)
      this.comments = commtens
    else
      this.comments = []
  }

  // Submit a new comment
  async onSubmit() {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        Id: this.comments.length + 1, // Generate a new ID (replace with backend logic)
        LocationId: this.locationId,
        AuthorId: this.user.userId, // Replace with logged-in user ID
        AuthorName: this.user.username, // Replace with logged-in user name
        Date: new Date().toLocaleString('pt-BR').replace('T', ' '), // Current date
        Comment: this.commentForm.value.commentText,
      };

      const newId = await this.dataService.addComment(newComment);
      await this.loadComments()
      this.commentForm.reset(); // Reset the form
    }
  }

  // Delete a comment by ID
  async deleteComment(commentId: number) {
    await this.dataService.deleteComment(commentId);
    await this.loadComments();
  }

  async editComment(comment: Comment) {
    const updatedText = prompt('Edit your comment:', comment.Comment);
    if (updatedText !== null && updatedText.trim() !== '') {
      comment.Comment = updatedText.trim();
      await this.dataService.updateComment(comment);
    }
  }
}