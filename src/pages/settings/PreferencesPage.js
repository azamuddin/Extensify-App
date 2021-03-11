import React, {Component} from 'react';
import {View} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {withOnyx} from 'react-native-onyx';
import PropTypes from 'prop-types';
import ToggleSwitch from 'toggle-switch-react-native';

import HeaderWithCloseButton from '../../components/HeaderWithCloseButton';
import {redirect} from '../../libs/actions/App';
import HeaderGap from '../../components/HeaderGap';
import ROUTES from '../../ROUTES';
import ONYXKEYS from '../../ONYXKEYS';
import styles from '../../styles/styles';
import colors from '../../styles/colors';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import NameValuePair from '../../libs/actions/NameValuePair';
import CONST from '../../CONST';
import {DownArrow} from '../../components/Icon/Expensicons';
import {setExpensifyNewsStatus} from '../../libs/actions/User';

const propTypes = {
    // The chat priority mode
    priorityMode: PropTypes.string,

    // The details about the user that is signed in
    user: PropTypes.shape({
        // Whether or not the user is subscribed to news updates
        expensifyNewsStatus: PropTypes.bool,
    }),
};

const defaultProps = {
    priorityMode: CONST.PRIORITY_MODE.DEFAULT,
    user: {},
};

const priorityModes = {
    default: {
        value: CONST.PRIORITY_MODE.DEFAULT,
        label: 'Most Recent',
        description: 'This will display all chats by default, sorted by most recent, with pinned items at the top',
    },
    gsd: {
        value: CONST.PRIORITY_MODE.GSD,
        label: 'GSD',
        description: 'This will only display unread and pinned chats, all sorted alphabetically. Get Shit Done.',
    },
};

class PreferencesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNewsStatusEnabled: !(this.props.user.expensifyNewsStatus === false),
        };
        this.toggleNewsStatus = this.toggleNewsStatus.bind(this);
    }

    toggleNewsStatus(toggle) {
        this.setState({isNewsStatusEnabled: toggle});
        setExpensifyNewsStatus(toggle);
    }

    render() {
        return (
            <>
                <HeaderGap />
                <HeaderWithCloseButton
                    title="Preferences"
                    shouldShowBackButton
                    onBackButtonPress={() => redirect(ROUTES.SETTINGS)}
                    onCloseButtonPress={() => redirect(ROUTES.HOME)}
                />
                <View style={styles.pageWrapper}>
                    <View style={[styles.settingsPageBody, styles.mb6]}>
                        <View style={[styles.flexRow, styles.mb5, styles.justifyContentBetween]}>
                            <Text>
                                Relevent feature updates and
                                {'\n'}
                                Expensify news
                            </Text>
                            <ToggleSwitch
                                isOn={this.state.isNewsStatusEnabled}
                                onColor={colors.green}
                                onToggle={this.toggleNewsStatus}
                            />
                        </View>
                        <Text style={[styles.formLabel]} numberOfLines={1}>
                            Priority Mode
                        </Text>
                        <View style={[styles.mb2]}>
                            {/* empty object in placeholder below to prevent default */}
                            {/* placeholder from appearing as a selection option. */}
                            <RNPickerSelect
                                onValueChange={
                                    mode => NameValuePair.set(CONST.NVP.PRIORITY_MODE, mode, ONYXKEYS.PRIORITY_MODE)
                                }
                                items={Object.values(priorityModes)}
                                style={styles.picker}
                                useNativeAndroidPickerStyle={false}
                                placeholder={{}}
                                value={this.props.priorityMode}
                                Icon={() => <Icon src={DownArrow} />}
                            />
                        </View>
                        <Text style={[styles.textLabel, styles.colorMuted]}>
                            {priorityModes[this.props.priorityMode].description}
                        </Text>
                    </View>
                </View>
            </>
        );
    }
}

PreferencesPage.propTypes = propTypes;
PreferencesPage.defaultProps = defaultProps;
PreferencesPage.displayName = 'PreferencesPage';

export default withOnyx({
    priorityMode: {
        key: ONYXKEYS.PRIORITY_MODE,
    },
    user: {
        key: ONYXKEYS.USER,
    },
})(PreferencesPage);
