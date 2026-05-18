import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild, computed, effect, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AttestationRecord } from '../../models/attestation-record';
import { AttestationStoreService } from '../../services/attestation-store.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  readonly attestationTypes = ['LINKS', 'FEDS', 'CHIPS', 'SWIFT', 'CLEARING', 'Others'];
  readonly years = Array.from({ length: 11 }, (_, index) => new Date().getFullYear() - index);
  readonly displayedColumns = ['srNo', 'fileName', 'fileType', 'attestationType', 'year', 'uploadedBy', 'uploadDate', 'fileSize', 'status', 'remarks', 'actions'];
  readonly selectedFile = signal<File | null>(null);
  readonly records = computed(() => this.store.records());
  readonly dataSource = new MatTableDataSource<AttestationRecord>([]);

  readonly form = this.fb.nonNullable.group({
    attestationType: ['', Validators.required],
    year: [new Date().getFullYear(), Validators.required],
    remarks: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: AttestationStoreService,
    private readonly auth: AuthService,
    private readonly snackBar: MatSnackBar,
  ) {
    effect(() => {
      this.dataSource.data = this.records();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.selectedFile.set(event.dataTransfer?.files?.[0] ?? null);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  upload(): void {
    this.snackBar.open(this.selectedFile() ? 'File ready for attestation submission' : 'Select a file to upload', 'Dismiss', { duration: 2500 });
  }

  submit(): void {
    const file = this.selectedFile();
    if (!file || this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Complete required upload details', 'Dismiss', { duration: 3000 });
      return;
    }

    const value = this.form.getRawValue();
    this.store.add({
      id: crypto.randomUUID(),
      fileName: file.name,
      fileType: file.type || file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      attestationType: value.attestationType,
      year: value.year,
      uploadedBy: this.auth.user()?.username ?? 'user',
      uploadDate: new Date().toISOString(),
      fileSize: this.formatSize(file.size),
      fileSizeBytes: file.size,
      status: 'Submitted',
      remarks: value.remarks,
    });

    this.selectedFile.set(null);
    this.form.reset({ attestationType: '', year: new Date().getFullYear(), remarks: '' });
    this.snackBar.open('Attestation submitted', 'Dismiss', { duration: 3000 });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  view(record: AttestationRecord): void {
    this.snackBar.open(`Viewing metadata for ${record.fileName}`, 'Dismiss', { duration: 2500 });
  }

  download(record: AttestationRecord): void {
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.fileName}.metadata.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  delete(id: string): void {
    this.store.delete(id);
  }

  private formatSize(bytes: number): string {
    if (!bytes) {
      return '0 KB';
    }

    const units = ['Bytes', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
  }
}
