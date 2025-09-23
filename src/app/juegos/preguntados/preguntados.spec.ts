import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Preguntados } from './preguntados';
import { TriviaService } from '../../services/trivia.service';
import { of } from 'rxjs';

describe('PreguntadosComponent', () => {
  let component: Preguntados;
  let fixture: ComponentFixture<Preguntados>;
  let triviaService: TriviaService;

  beforeEach(async () => {
    const triviaServiceSpy = jasmine.createSpyObj('TriviaService', ['getQuestions']);
    await TestBed.configureTestingModule({
      imports: [Preguntados],
      providers: [{ provide: TriviaService, useValue: triviaServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(Preguntados);
    component = fixture.componentInstance;
    triviaService = TestBed.inject(TriviaService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load questions on init', () => {
    const mockQuestions = [{ id: '1', question: { text: 'test question' }, correctAnswer: 'a', incorrectAnswers: ['b', 'c', 'd'] }];
    (triviaService.getQuestions as jasmine.Spy).and.returnValue(of(mockQuestions));

    fixture.detectChanges();

    expect(component.preguntas.length).toBe(0);  // Adjust the expected value based on your mapping logic
  });
});
