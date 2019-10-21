<script>

var fluxes = {
  "EX_pi_e": 0,
  "EX_pi_e_REV": 1,
  "arm_test": 1,
  "testNo1": 1,
  "testNo2": 0,
  "test2No1": 1,
  "test3No1": 1,
  "arm_abc": 0,
  "abcNo1": 0,
  "abcNo2": 0,
  "arm_abc_REV": 1,
  "abc_REVNo1": 0,
  "abc_REVNo2": 1
};

const fluxesMapped = {};
Object.keys(fluxes).forEach(rxn => {
  newRxn = rxn;
  newFlux = fluxes[rxn];
  if (rxn.startsWith("arm_")) {
    // For isozymes, use the flux in the reaction "arm_XXX".
    newRxn = rxn.substring(4);
  } else if (rxn.endsWith("No1")) {
    // For single enzymes, use the flux in the reaction "XXXNo1" (for
    // this, check first that no arm reaction is already present).
    rootRxn = rxn.substring(0, rxn.length - 3);
    if (!Object.keys(fluxesMapped).includes(rootRxn)) {
      newRxn = rootRxn;
    }
  }
  fluxesMapped[newRxn] = newFlux;
  if (newRxn.endsWith("_REV") && fluxes[rxn] > 0) {
    // For reversible enzymes ("XXX_REV") that are active in the backwards
    // direction, replace the existing flux in the forward reaction by the
    // negative value.
    newRxn = newRxn.substring(0, newRxn.length - 4);
    newFlux = newFlux * -1;
    fluxesMapped[newRxn] = newFlux;
  }
});

Object.keys(fluxesMapped).forEach(rxn => {
  document.write(rxn + ": " + fluxesMapped[rxn] + "<br>");
});

</script>
