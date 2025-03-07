import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../models/comment.model';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

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

  constructor(private fb: FormBuilder, private dataService: DataService) {
    this.commentForm = this.fb.group({
      commentText: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    // Load initial comments (you can replace this with an API call)
    this.loadComments();
  }

  // Load initial comments (mock data)
  async loadComments() {
    let commtens = await this.dataService.getCommentsByLocationId(this.locationId);
    if (commtens)
      this.comments = commtens
  }

  // Submit a new comment
  onSubmit(): void {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        Id: this.comments.length + 1, // Generate a new ID (replace with backend logic)
        LocationId: this.locationId,
        AuthorId: 103, // Replace with logged-in user ID
        AuthorName: 'Current User', // Replace with logged-in user name
        Date: new Date().toISOString().split('T')[0], // Current date
        Comment: this.commentForm.value.commentText,
      };

      this.comments.push(newComment); // Add the new comment to the list
      this.commentForm.reset(); // Reset the form
    }
  }

  // Delete a comment by ID
  deleteComment(commentId: number): void {
    this.comments = this.comments.filter((comment) => comment.Id !== commentId);
  }

  editComment(comment: Comment): void {
    const updatedText = prompt('Edit your comment:', comment.Comment);
    if (updatedText !== null && updatedText.trim() !== '') {
      comment.Comment = updatedText.trim();
    }
  }
}