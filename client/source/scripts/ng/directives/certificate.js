export default function ($cookies) {
    return {
        restrict: 'EA',
        controller: 'certificate_render',
        scope: {
            data: '='
        },
        templateUrl: '/src/scripts/ng/views/directives/certificate.html'
    }
}
