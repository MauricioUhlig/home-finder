const AddModal = {
    props: {
        latitude: Number,
        longitude: Number
    },
    data() {
        return {
            pointTypes: [{
                id: 1,
                name: "Casa"
            },
            {
                id: 2,
                name: "Lote"
            }],
            newPoint: {
                name: '',
                details: '',
                lat: this.latitude,
                lng: this.longitude,
                type: ''
            }
        }
    },
    methods: {
        save() {
            this.$emit('save', this.newPoint);
        }
    },
    template: `
        <div class="modal fade" id="novo-local-modal" tabindex="-1" aria-labelledby="novo-local-modal-label"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content shadow-lg rounded-3">

                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="novo-local-label">Adicionar Ponto</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="name" class="form-label fw-semibold">Título:</label>
                            <input type="text" v-model="name" class="form-control" required
                                placeholder="Digite um título">
                        </div>
                        <div class="mb-3">
                            <label for="details" class="form-label fw-semibold">Detalhes:</label>
                            <input type="text" v-model="details" class="form-control" required
                                placeholder="Adicione detalhes">
                        </div>
                        <div class="mb-3">
                            <label for="details" class="form-label fw-semibold">Detalhes:</label>
                            <select class="form-select" aria-label="Default select example" v-model="type">
                                <option v-for="type in pointTypes" v-value:bind="type.id">{{type.name}}</option>
                            </select>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="latitude" class="form-label fw-semibold">Latitude:</label>
                                <input type="number" v-model="lat" step="any" class="form-control" required
                                    disabled>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="longitude" class="form-label fw-semibold">Longitude:</label>
                                <input type="number" v-model="lng" step="any" class="form-control" required
                                    disabled>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                            <i class="bi bi-x-circle"></i> Cancelar
                        </button>
                        <button type="submit" class="btn btn-success" data-bs-dismiss="modal" @click="save">
                            <i class="bi bi-check-circle"></i> Salvar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    `
};
