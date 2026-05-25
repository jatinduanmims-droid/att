/*
  Paste these snippets into your existing component .ts files.
  They do not change any API/KPI calls and they keep your existing
  template function names: isAttestationFrozen(), openFreezeDialog(),
  openUnfreezeDialog(), workflowSteps, and onStepClick().
*/

/* -------------------------------------------------------------------------- */
/* upload.component.ts                                                        */
/* -------------------------------------------------------------------------- */

// Add these members inside UploadComponent.
private readonly attestationFreezeStorageKey = 'controls-attestation.freezeState';

isFrozen = false;

ngOnInit(): void {
  // Keep any existing ngOnInit logic you already have, then add this line.
  this.isFrozen = this.readAttestationFreezeState();
}

isAttestationFrozen(): boolean {
  return this.isFrozen;
}

private readAttestationFreezeState(): boolean {
  return localStorage.getItem(this.attestationFreezeStorageKey) === 'true';
}

private setAttestationFreezeState(isFrozen: boolean): void {
  this.isFrozen = isFrozen;
  localStorage.setItem(this.attestationFreezeStorageKey, String(isFrozen));

  window.dispatchEvent(
    new CustomEvent('attestation-freeze-state-changed', {
      detail: { isFrozen }
    })
  );
}

// If your openFreezeDialog() only opens a confirmation dialog today,
// keep that dialog code and call this.setAttestationFreezeState(true)
// only after the user confirms.
openFreezeDialog(): void {
  this.setAttestationFreezeState(true);
}

// Same here: keep your existing confirmation dialog if you have one,
// then call this after confirmation.
openUnfreezeDialog(): void {
  this.setAttestationFreezeState(false);
}

/* -------------------------------------------------------------------------- */
/* home.component.ts                                                          */
/* -------------------------------------------------------------------------- */

// Add these members inside HomeComponent.
private readonly attestationFreezeStorageKey = 'controls-attestation.freezeState';

ngOnInit(): void {
  // Keep any existing ngOnInit logic you already have, then add these lines.
  this.applyFreezeStateToWorkflow();

  window.addEventListener(
    'storage',
    this.handleAttestationFreezeStateChange
  );

  window.addEventListener(
    'attestation-freeze-state-changed',
    this.handleAttestationFreezeStateChange as EventListener
  );
}

ngOnDestroy(): void {
  // Keep any existing ngOnDestroy logic you already have, then add these lines.
  window.removeEventListener(
    'storage',
    this.handleAttestationFreezeStateChange
  );

  window.removeEventListener(
    'attestation-freeze-state-changed',
    this.handleAttestationFreezeStateChange as EventListener
  );
}

private readonly handleAttestationFreezeStateChange = (): void => {
  this.applyFreezeStateToWorkflow();
};

private isAttestationFrozenFromStorage(): boolean {
  return localStorage.getItem(this.attestationFreezeStorageKey) === 'true';
}

private applyFreezeStateToWorkflow(): void {
  const isFrozen = this.isAttestationFrozenFromStorage();

  this.workflowSteps = this.workflowSteps.map((step: any) => {
    if (isFrozen) {
      if (step.id === 1) {
        return {
          ...step,
          completed: true,
          status: 'done'
        };
      }

      if (step.id === 2) {
        return {
          ...step,
          completed: false,
          status: 'current'
        };
      }

      return {
        ...step,
        completed: false,
        status: 'pending'
      };
    }

    if (step.id === 1) {
      return {
        ...step,
        completed: false,
        status: 'current'
      };
    }

    return {
      ...step,
      completed: false,
      status: 'pending'
    };
  });
}

onStepClick(stepId: number): void {
  const targetStep = this.workflowSteps.find((step: any) => step.id === stepId);

  if (!targetStep || targetStep.status === 'pending') {
    return;
  }

  // Keep your existing navigation/action logic below this guard.
}
