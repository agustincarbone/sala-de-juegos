import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AhorcadoModule } from './ahorcado.module';
import { Ahorcado } from './ahorcado';

describe('Ahorcado', () => {
  let component: Ahorcado;
  let fixture: ComponentFixture<Ahorcado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AhorcadoModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ahorcado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
