import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';
import { FullLocation } from '../models/full-location.model';
import { LocationMetrics } from '../models/location-metrics.model';
import { Comment } from '../models/comment.model';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root', // Provided in the root injector (singleton)
})
export class DataService {
  public isLoading: boolean = false;
  private apiUrl = '/api'; // Base API URL

  constructor(private http: HttpClient) {}

  private locations! : FullLocation[];
  // Get all locations
  async getAllLocations(): Promise<FullLocation[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: FullLocation[] }>(`${this.apiUrl}/locations/`)
      );
      this.locations = response.data;
      return this.locations;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  }

  // Get location by ID
  async getById(id: number): Promise<FullLocation | undefined> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: FullLocation }>(`${this.apiUrl}/locations/${id}`)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching location with ID ${id}:`, error);
      throw error;
    }
  }

  // Get metrics by location ID
  async getMetricsByLocationId(id: number): Promise<LocationMetrics | undefined> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: LocationMetrics }>(`${this.apiUrl}/metrics/location/${id}`)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching metrics for location ID ${id}:`, error);
      throw error;
    }
  }

  // Get comments by location ID
  async getCommentsByLocationId(id: number): Promise<Comment[] | undefined> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ data: any[] }>(`${this.apiUrl}/comments/location/${id}`)
      );
      if(response.data)
        return response.data.map(comment =>  comment = { ...comment, Date: new Date(comment.Date).toLocaleString('pt-br')})
      return undefined
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Add a new comment
  async addComment(comment: Comment): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ data: number }>(`${this.apiUrl}/comments/`, comment, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (response.data) {
        return response.data; // Success
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      return 0; // Error
    }
  }

  // Delete a comment by ID
  async deleteComment(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/comments/${id}`));
      return true;
    } catch (error) {
      console.error(`Error deleting comment with ID ${id}:`, error);
      return false;
    }
  }

  // Update a comment
  async updateComment(comment: Comment): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.put<{ data: Comment }>(`${this.apiUrl}/comments/${comment.ID}`, comment, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (response.data.ID) {
        return true; // Success
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error(`Error updating comment with ID ${comment.ID}:`, error);
      return false;
    }
  }

  // Add a new location
  async add(location: FullLocation): Promise<number> {
    try {
        const payload: FullLocation = 
        {
            ...location, 
            Marker: null,
        }
      const response = await firstValueFrom(
        this.http.post<{ data: Location }>(`${this.apiUrl}/locations`, payload, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (response.data.ID) {
        location.ID = response.data.ID;
        this.locations.push(location)
        return response.data.ID; // Success
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      return -1; // Error
    }
  }
  
   async update(location: FullLocation): Promise<number> {
    try {
        const payload: Location = 
        {
            ...location, 
            Marker: null,
        }
      const response = await firstValueFrom(
        this.http.put<{ data: Location }>(`${this.apiUrl}/locations/${location.ID}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (response.data.ID) {
        this.upsertLocalLocation(location)
        return response.data.ID; // Success
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding location:', error);
      return -1; // Error
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete(`${this.apiUrl}/locations/${id}`));
      this.removeLocalLocation(id)
      return true;
    } catch (error) {
      console.error(`Error deleting location with ID ${id}:`, error);
      return false;
    }
  }

  // Save or update location metrics
  async saveMetric(metric: LocationMetrics): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ data: LocationMetrics }>(`${this.apiUrl}/metrics/${metric.LocationID}`, metric, {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      if (response.data.ID) {
        return true; // Success
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error saving metrics:', error);
      return false;
    }
  }

  async uploadFile(file: any): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await firstValueFrom(this.http.post<{ message: string; filename: string, uri: string }>(`${this.apiUrl}/files/upload`, formData))
    if(response.uri)
      return response.uri
    return ''
  }

  upsertLocalLocation(newLocation: FullLocation): void {
    const index = this.locations.findIndex(loc => loc.ID === newLocation.ID);

    if (index !== -1) {
      // Update existing location
      this.locations[index] = { ...this.locations[index], ...newLocation };
    } else {
      // Insert new location
      this.locations.push(newLocation);
    }
  }

  removeLocalLocation(id: number): void {
    this.locations = this.locations.filter(loc => loc.ID !== id);
  }


}