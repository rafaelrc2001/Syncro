function initEquipmentToggle() {
    const equipmentRadios = document.querySelectorAll('input[name="has-equipment"]');
    const equipmentFields = [
        document.getElementById('equipment').closest('.form-group'),
        document.getElementById('tag').closest('.form-group'),
        document.getElementById('equipment-conditions-title'),
        document.getElementById('equipment-conditions-grid')
    ];

    function toggleEquipmentFields() {
        const showEquipment = document.querySelector('input[name="has-equipment"]:checked').value === 'si';
        equipmentFields.forEach(element => {
            if (element) element.style.display = showEquipment ? 'block' : 'none';
        });
        const equipmentField = document.getElementById('equipment');
        if (equipmentField) equipmentField.required = showEquipment;
    }

    equipmentRadios.forEach(radio => {
        radio.addEventListener('change', toggleEquipmentFields);
    });

    toggleEquipmentFields();
}

document.addEventListener('DOMContentLoaded', () => {
    initEquipmentToggle();

    // Campo "OTRO"
    const maintenanceSelect = document.getElementById('maintenance-type');
    const otherContainer = document.getElementById('other-maintenance-container');

    if (maintenanceSelect && otherContainer) {
        maintenanceSelect.addEventListener('change', function () {
            otherContainer.style.display = this.value === 'OTRO' ? 'block' : 'none';
        });
    }
});

