import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { IngredientPageComponent } from './Ingredientes/components/ingredient-page/ingredient-page.component';
import { UserPageComponent } from './users/components/user-page/user-page.component';
import { LoginComponent } from './auth/components/login/login.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: 'ingredientes', component: IngredientPageComponent },
    { path: 'users', component: UserPageComponent },
    { path: 'login', component: LoginComponent},
    { path: '**', redirectTo: '' } // Redirige a la página principal para ruta inexistente, posicionar sus rutas arriba de esta
    
];

