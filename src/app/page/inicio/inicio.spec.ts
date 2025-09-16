import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inicio } from './inicio';

// 2. Describe el conjunto de pruebas usando el nombre del componente.
describe('Inicio', () => {
  let component: Inicio;
  let fixture: ComponentFixture<Inicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inicio] // 3. Importa el componente en el módulo de pruebas.
    })
    .compileComponents();

    fixture = TestBed.createComponent(Inicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
