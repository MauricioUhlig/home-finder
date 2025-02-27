const LocationListMap = {
    props: {
        points: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            isExpanded: false, // State for expanded overlay
            screenWidth: window.innerWidth, // Track screen width
        };
    },
    computed: {
        isSmallScreen() {
            return this.screenWidth < 1200; // Define small screen breakpoint
        },
    },
    methods: {
        toggleOverlay() {
            this.isExpanded = !this.isExpanded; // Toggle overlay expansion
        },
        centerMap(point) {
            this.$emit('center-map', point); // Emit event to center the map
        },
    },
    mounted() {
        // Update screen width on window resize
        window.addEventListener('resize', () => {
            this.screenWidth = window.innerWidth;
        });
    },
    beforeDestroy() {
        // Clean up event listener
        window.removeEventListener('resize', () => {
            this.screenWidth = window.innerWidth;
        });
    },
    template: `
    <template>
        <div id="location-list-map" class="d-flex flex-colum-reverse h-100">
            <slot></slot> <!-- Slot for additional content -->

            <!-- Overlay for small screens -->
            <div v-if="isSmallScreen" class="overlay z" :class="{ expanded: isExpanded }">
                <div id="list-container" class="bg-light padding">
                    <div class="bg-light">
                        <div class="accordion-header">
                            <button type="button" class="w-100 button-expand bg-light" @click="toggleOverlay">
                                <div class="itens">
                                    <h5 class="modal-title start-0" id="novo-local-label">Lista de Locais</h5>
                                    <i class="fa-solid"
                                        :class="{ 'fa-chevron-up': !isExpanded, 'fa-chevron-down': isExpanded}"></i>
                                </div>
                            </button>
                        </div>
                    </div>
                    <ul id="dynamic-list" class="list-group">
                        <div v-for="(point, index) in points" :key="index" class="point-item" @click="centerMap(point)">
                            <li class="list-group-item d-flex justify-content-between align-items-center list-item">
                                <div>
                                    <strong>{{ point.name }}</strong>
                                    <br>
                                    <small>{{point.details}}</small>
                                </div>
                            </li>
                        </div>
                    </ul>
                </div>
            </div>

            <!-- Lateral bar for larger screens -->
            <div v-else class="lateral-bar padding bg-light z">
                <h5 class="modal-title">Lista de Locais</h5>
                <ul id="dynamic-list" class="list-group">
                    <div v-for="(point, index) in points" :key="index" class="point-item" @click="centerMap(point)">
                        <li class="list-group-item d-flex justify-content-between align-items-center list-item">
                            <div>
                                <strong>{{ point.name }}</strong>
                                <br>
                                <small>{{point.details}}</small>
                            </div>
                        </li>
                    </div>
                </ul>
            </div>
        </div>
    </template>
    `,
};