import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NativeInstalledPackagesExplicitComponent } from '../native-installed-packages-explicit/native-installed-packages-explicit.component';
import { Package } from '../../model/Package';
import { NativePackagesService } from '../../services/native-packages.service';
import { NativeInstalledPackagesExplicitLiteComponent } from '../native-installed-packages-explicit-lite/native-installed-packages-explicit-lite.component';
import { PackagesToUpgrade } from '../../model/PackagesToUpgrade';
import { NativePackagesToUpgradeComponent } from '../native-packages-to-upgrade/native-packages-to-upgrade.component';

@Component({
    selector: 'app-main-menu',
    standalone: true,
    imports: [HttpClientModule, NativeInstalledPackagesExplicitComponent,
        NativeInstalledPackagesExplicitLiteComponent, NativePackagesToUpgradeComponent],
    templateUrl: './main-menu.component.html',
    styleUrl: './main-menu.component.css'
})
export class MainMenuComponent {

    packages!: Package[];
    total!: number;
    nativePackagesService = inject(NativePackagesService);
    router = inject(Router);
    renderView!: string;
    packagesToUpgrade!: PackagesToUpgrade[];
    errorMessage!: string;

    getNativeInstalledPackages() {
        this.nativePackagesService.getExplicitInstalledPackages().subscribe(
            response => {
                this.packages = response.packages;
                this.total = this.packages.length;
                this.renderView = "nativePackages";
            }
        );
    }

    getExplicitInstalledPackagesLite() {
        this.nativePackagesService.getExplicitInstalledPackagesLite().subscribe(
            response => {
                this.packages = response.packages;
                this.total = this.packages.length;
                this.renderView = "nativePackagesLite";
            }
        );
    }

    getPackagesToUpgrade() {
        let rootPassword = prompt("Root password") ?? ''; // ?? si es null ''

        this.nativePackagesService.getPackagesToUpgrade(rootPassword).subscribe(
            response => {
                this.packagesToUpgrade = response.packages;
                this.total = this.packagesToUpgrade.length;
                this.renderView = "packagesToUpgrade";
            },
            jsonError => {
                this.renderView = "packagesToUpgradeError";
                let httpCode = jsonError.status;

                switch (httpCode) {
                    case 400:
                        this.errorMessage = jsonError.error.message;
                        break;

                    case 204:
                        this.errorMessage = "No packages to upgrade";
                        break;
                }
            }
        );
    }
}