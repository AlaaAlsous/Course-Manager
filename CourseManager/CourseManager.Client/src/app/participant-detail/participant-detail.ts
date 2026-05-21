import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Layout } from '../layout/layout';
import ContentModule from '../content-module/content-module';

@Component({
  selector: 'app-participant-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, Layout, ContentModule],
  templateUrl: './participant-detail.html',
  styleUrls: ['./participant-detail.scss'],
})
export class ParticipantDetail implements OnInit {
  title = signal('Participant Detail');

  selectedPerson: any;

  newNote = '';

  newCourse = '';

  persons = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      imageUrl: 'https://i.pravatar.cc/300?img=1',
      address: '123 Main St, Anytown, USA',
      courses: ['Course 1', 'Course 2'],
      notes: [
        { id: 1, text: 'Note 1', createdAt: '2023-01-01' },
        { id: 2, text: 'Note 2', createdAt: '2023-01-02' },
      ],
      gallery: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '987-654-3210',
      imageUrl: 'https://i.pravatar.cc/300?img=2',
      address: '456 Elm St, Othertown, USA',
      courses: ['Course 3', 'Course 4'],
      notes: [
        { id: 3, text: 'Note 3', createdAt: '2023-01-03' },
        { id: 4, text: 'Note 4', createdAt: '2023-01-04' },
      ],
      gallery: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '555-555-5555',
      imageUrl: 'https://i.pravatar.cc/300?img=3',
      address: '789 Oak St, Sometown, USA',
      courses: ['Course 5', 'Course 6'],
      notes: [
        { id: 5, text: 'Note 5', createdAt: '2023-01-05' },
        { id: 6, text: 'Note 6', createdAt: '2023-01-06' },
      ],
      gallery: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('id'));

    this.selectedPerson = this.persons.find((person) => person.id === id);
  }
}
