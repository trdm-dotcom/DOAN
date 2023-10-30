import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FlatGrid} from 'react-native-super-grid';
import {ThemeColors} from 'src/constants/Types';
import UserCard from '../user/UserCard';
import SvgBanner from '../SvgBanner';
import BottomSheetHeader from '../header/BottomSheetHeader';
import {AppContext} from '../../context';
import EmptyConnectionsBanner from '../../../assets/svg/empty-connections.svg';

interface ConnectionsBottomSheetProps {
  ref: React.Ref<any>;
  viewMode?: boolean;
  data: any[];
  name?: string;
}

const ConnectionsBottomSheet: React.FC<ConnectionsBottomSheetProps> =
  React.forwardRef(({viewMode, name, data}, ref) => {
    const {theme} = useContext(AppContext);

    let heading = 'Friends';
    let subHeading = viewMode
      ? `People who are following ${name}`
      : 'People who are following you';

    const ListEmptyComponent = () => (
      <SvgBanner
        Svg={EmptyConnectionsBanner}
        placeholder="No users found"
        spacing={16}
      />
    );

    const renderItem = ({item}) => {
      return (
        <UserCard userId={item.id} avatar={item.avatar} name={item.name} />
      );
    };

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{showsVerticalScrollIndicator: false}}
        modalStyle={styles(theme).container}>
        <BottomSheetHeader heading={heading} subHeading={subHeading} />
        <View style={styles(theme).content}>
          <FlatGrid
            bounces={false}
            itemDimension={responsiveWidth(85)}
            showsVerticalScrollIndicator={false}
            data={data}
            itemContainerStyle={styles().listItemContainer}
            contentContainerStyle={styles().listContentContainer}
            ListEmptyComponent={ListEmptyComponent}
            style={styles().listContainer}
            spacing={20}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </Modalize>
    );
  });

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      flex: 1,
      paddingBottom: responsiveHeight(5),
    },
    listContainer: {
      flex: 1,
    },
    listItemContainer: {
      width: '106%',
    },
    listContentContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

export default ConnectionsBottomSheet;
