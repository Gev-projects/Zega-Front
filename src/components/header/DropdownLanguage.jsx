// react
import React from "react";

// third-party
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

// application
import Dropdown from "./Dropdown";
import { localeChange } from "../../store/locale";

import ArmSvg from "../../images/Arm.png";
import EngSvg from "../../images/Eng.png";
import RusSvg from "../../images/Rus.png";

function DropdownLanguage(props) {
    if (!props.languages) {
        return null;
    }

    const { locale: code, localeChange: changeLocale } = props;
    const languages = props.languages.map((e) => {
        if (e.locale_image) return e;
        if (e.code == "en") {
            e.locale_image = EngSvg;
            e.icon = EngSvg;
        } else if (e.code == "ru") {
            e.locale_image = RusSvg;
            e.icon = RusSvg;
        } else {
            e.locale_image = ArmSvg;
            e.icon = ArmSvg;
        }

        return e;
    });

    const title = (
        <React.Fragment>
            <FormattedMessage id="topbar.language" defaultMessage="Armenian" />
            {/* {': '}
            <span className="topbar__item-value">{language.code}</span> */}
        </React.Fragment>
    );

    const filtered = languages.filter((language) => {
        return language.code == code;
    });
    const locale = filtered.length ? filtered : [languages[0]];

    return (
        <Dropdown
            title={title}
            withIcons
            locale={locale}
            items={languages}
            onClick={(item) => changeLocale(item.code)}
        />
    );
}

const mapStateToProps = (state) => ({
    locale: state.locale,
    languages: state.general.languages,
});

const mapDispatchToProps = {
    localeChange,
};

export default connect(mapStateToProps, mapDispatchToProps)(DropdownLanguage);
