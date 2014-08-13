/*
 * Copyright (c) 2014 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

angular.module('ui.dashboard')
  .factory('WidgetModel', function () {
    // constructor for widget model instances
    function WidgetModel(Class, overrides) {
      var defaults = {
          title: 'Widget',
          name: Class.name,
          attrs: Class.attrs,
          dataAttrName: Class.dataAttrName,
          dataModelType: Class.dataModelType,
          dataModelArgs: Class.dataModelArgs, // used in data model constructor, not serialized
          //AW Need deep copy of options to support widget options editing
          dataModelOptions: Class.dataModelOptions,
          settingsModalOptions: Class.settingsModalOptions,
          onSettingsClose: Class.onSettingsClose,
          onSettingsDismiss: Class.onSettingsDismiss,
          style: Class.style,
          innerStyle: Class.innerStyle
        };
      overrides = overrides || {};
      angular.extend(this, angular.copy(defaults), overrides);
      this.style = this.style || { width: '33%' };
      this.innerStyle = this.innerStyle || { height: 'auto' };
      this.setWidth(this.style.width);
      this.setHeight(this.innerStyle.height);

      if (Class.templateUrl) {
        this.templateUrl = Class.templateUrl;
      } else if (Class.template) {
        this.template = Class.template;
      } else {
        var directive = Class.directive || Class.name;
        this.directive = directive;
      }
    }

    WidgetModel.prototype = {
      // sets the width (and widthUnits)
      setWidth: function (width, units) {
        width = width.toString();
        units = units || width.replace(/^[-\.\d]+/, '') || '%';
        this.widthUnits = units;
        width = parseFloat(width);

        if (width < 0) {
          return false;
        }

        if (units === '%') {
          width = Math.min(100, width);
          width = Math.max(0, width);
        }
        this.style.width = width + '' + units;
        return true;
      },

      setHeight: function(height, units) {
        if (typeof height === 'undefined') {
          this.innerStyle.height = 'auto';
          delete this.heightUnits;
          return true;
        }
        height = height.toString();
        units = units || height.replace(/^[-\.\d]+/, '') || 'px';
        this.heightUnits = units;
        height = parseFloat(height);

        if (height < 0) {
          return false;
        }

        if (units === '%') {
          height = Math.min(100, height);
          height = Math.max(0, height);
        }
        this.innerStyle.height = height + '' + units;
        return true;
      }
    };

    return WidgetModel;
  });