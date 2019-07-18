import React from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

class SourceTab extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Tab">
        <JSONInput
          id="a_unique_id"
          locale={locale}
          onKeyPressUpdate={false}
          waitAfterKeyPress={5000}
          height="550px"
        />
      </div>
    );
  }
}

export default SourceTab;

/*
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
<JSONInput
          id="a_unique_id"
          locale={locale}
          onKeyPressUpdate={false}
          waitAfterKeyPress={5000}
          height="550px"
        />*/
