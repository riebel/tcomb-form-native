import React, { useState } from "react";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import {
  Platform,
  View,
  Text,
  TouchableNativeFeedback
} from "react-native";

function datepicker(locals) {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var datepickerStyle = stylesheet.datepicker.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;
  var dateValueStyle = stylesheet.dateValue.normal;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    datepickerStyle = stylesheet.datepicker.error;
    helpBlockStyle = stylesheet.helpBlock.error;
    dateValueStyle = stylesheet.dateValue.error;
  }

  // Setup the picker mode
  var datePickerMode = locals.mode;
  if (
    datePickerMode !== "date" &&
    datePickerMode !== "time" &&
    datePickerMode !== "datetime"
  ) {
    throw new Error(`Unrecognized date picker format ${datePickerMode}`);
  }

  /**
   * Check config locals for Android datepicker.
   * `locals.config.background: `TouchableNativeFeedback` background prop
   * `locals.config.format`: Date format function
   * `locals.config.dialogMode`: 'calendar', 'spinner', 'default'
   * `locals.config.dateFormat`: Date only format
   * `locals.config.timeFormat`: Time only format
   */
  var formattedValue = locals.value ? String(locals.value) : "";
  var background = TouchableNativeFeedback.SelectableBackground(); // eslint-disable-line new-cap
  var dialogMode = "default";
  var formattedDateValue = locals.value ? locals.value.toDateString() : "";
  var formattedTimeValue = locals.value ? locals.value.toTimeString() : "";
  if (locals.config) {
    if (locals.config.format && formattedValue) {
      formattedValue = locals.config.format(locals.value);
    } else if (!formattedValue) {
      formattedValue = locals.config.defaultValueText
        ? locals.config.defaultValueText
        : "Tap here to select a date";
    }
    if (locals.config.background) {
      background = locals.config.background;
    }
    if (locals.config.dialogMode) {
      dialogMode = locals.config.dialogMode;
    }
    if (locals.config.dateFormat && formattedDateValue) {
      formattedDateValue = locals.config.dateFormat(locals.value);
    } else if (!formattedDateValue) {
      formattedDateValue = locals.config.defaultValueText
        ? locals.config.defaultValueText
        : "Tap here to select a date";
    }
    if (locals.config.timeFormat && formattedTimeValue) {
      formattedTimeValue = locals.config.timeFormat(locals.value);
    } else if (!formattedTimeValue) {
      formattedTimeValue = locals.config.defaultValueText
        ? locals.config.defaultValueText
        : "Tap here to select a time";
    }
  }

  var label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  var help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  var error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;
  var value = formattedValue ? (
    <Text style={dateValueStyle}>{formattedValue}</Text>
  ) : null;

  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  return (
    <View>
      {show && <RNDateTimePicker mode={mode} onChange={
        (event, date) => {
            var newDate = new Date(locals.value);
            newDate.setFullYear(date.year, date.month, date.day);
            newDate.setHours(date.hour);
            newDate.setMinutes(date.minute);
            locals.onChange(newDate);
            setShow(Platform.OS === "ios");
        }} />
      }
      <View style={formGroupStyle}>
        {datePickerMode === "datetime" ? (
          <View style={datepickerStyle}>
            {label}
            <TouchableNativeFeedback
              accessible={true}
              disabled={locals.disabled}
              ref={ref => (this.refs.input = ref)}
              background={background}
              onPress={function() {
                let config = {
                  date: locals.value || new Date(),
                  mode: dialogMode
                };
                if (locals.minimumDate) {
                  config.minDate = locals.minimumDate;
                }
                if (locals.maximumDate) {
                  config.maxDate = locals.maximumDate;
                }
                setMode("date");
                setShow(true);
                if (typeof locals.onPress === "function") {
                  locals.onPress();
                }
              }}
            >
              <View>
                <Text style={dateValueStyle}>{formattedDateValue}</Text>
              </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
              accessible={true}
              disabled={locals.disabled}
              ref={ref => (this.refs.input = ref)}
              background={background}
              onPress={function() {
                const now = new Date();
                const isDate = locals.value && locals.value instanceof Date;
                let setTime = {
                  hour: isDate ? locals.value.getHours() : now.getHours(),
                  minute: isDate ? locals.value.getMinutes() : now.getMinutes()
                };
                setMode("time");
                setShow(true);
                if (typeof locals.onPress === "function") {
                  locals.onPress();
                }
              }}
            >
              <View>
                <Text style={dateValueStyle}>{formattedTimeValue}</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        ) : (
          <TouchableNativeFeedback
            accessible={true}
            disabled={locals.disabled}
            ref={ref => (this.refs.input = ref)}
            background={background}
            onPress={function() {
              if (datePickerMode === "time") {
                const now = new Date();
                const isDate = locals.value && locals.value instanceof Date;
                let setTime = {
                  hour: isDate ? locals.value.getHours() : now.getHours(),
                  minute: isDate ? locals.value.getMinutes() : now.getMinutes()
                };
                setMode("time");
                setShow(true);
              } else if (datePickerMode === "date") {
                let config = {
                  date: locals.value || new Date(),
                  mode: dialogMode
                };
                if (locals.minimumDate) {
                  config.minDate = locals.minimumDate;
                }
                if (locals.maximumDate) {
                  config.maxDate = locals.maximumDate;
                }
                setMode("date");
                setShow(true);
              }
              if (typeof locals.onPress === "function") {
                locals.onPress();
              }
            }}
          >
            <View>
              {label}
              {value}
            </View>
          </TouchableNativeFeedback>
        )}
        {help}
        {error}
      </View>
    </View>
  );
}

module.exports = datepicker;
