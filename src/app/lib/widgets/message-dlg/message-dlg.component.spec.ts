import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDlgComponent } from './message-dlg.component';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

describe('MessageDlgComponent', () => {
  let component: MessageDlgComponent;
  let fixture: ComponentFixture<MessageDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageDlgComponent ],
      providers: [NgbActiveModal]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
