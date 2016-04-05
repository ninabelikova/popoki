var app = angular.module("app", []);

app.controller("MainControl", function ($scope) {
  $scope.pet = {};
  $scope.pet_to_play = {};
  $scope.started = false;

  $scope.add_pet = function (chosen_pet) {
    len = chosen_pet.name.length;
    if (0 < len && len < 5) {
      chosen_pet.name_short = true;
    } else if (4 < len && len < 8) {
      chosen_pet.name_medium = true;
    } else {
      chosen_pet.name_long = true;
    }
    $scope.pet = chosen_pet;
    $scope.started = true;
  };
});
