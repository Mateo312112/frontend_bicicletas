import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BicicletasComponent } from './bicicletas';  // ← Cambia Bicicletas a BicicletasComponent

describe('BicicletasComponent', () => {  // ← Cambia el nombre aquí también
  let component: BicicletasComponent;
  let fixture: ComponentFixture<BicicletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BicicletasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BicicletasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});