import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { injected } from "../components/Connectors";
import { useWeb3React } from "@web3-react/core"
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import axios, {AxiosResponse} from 'axios';
import SkeletonContent from 'react-native-skeleton-content';
import https from "https";

var nftList: { address: any; tokenId: number; }[] = [];

import { useWalletConnect } from '@walletconnect/react-native-dapp';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}
 
export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  // const { active, account, library, connector, activate, deactivate } = useWeb3React()
  const [collections, setCollections] = React.useState([{}]);
  const [loadingNFT, setLoadingNFT] = React.useState(false);

  // For Android connect
  const connector = useWalletConnect();

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  React.useEffect( () => {
    if(connector.connected){
      extract()
    }
  }, [connector]);

  // async function connect() {
  //   if (!window.ethereum) {
  //     alert("Please install Metamask.");
  //   }
  //   try {
  //     await activate(injected)
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }

  // async function disconnect() {
  //   try {
  //     deactivate()
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }

  const run = async () => {
    setLoadingNFT(true);

    const apiKey = "oZ7qNFwrzKqhtOVzQpZrvZIC_qjc4lw2";
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`;
    const axiosURL = `${baseURL}`;

    // const toAddress = connector.accounts[0];
    const toAddress = "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1";

    let requestParams = {
      "jsonrpc": "2.0",
      "id": 0,
      "method": "alchemy_getAssetTransfers",
      "params": [
        {
          "fromBlock": "0x0",
          "fromAddress": "0x0000000000000000000000000000000000000000",
          "toAddress": toAddress,
          "excludeZeroValue":true,
          "category": ["erc721","erc1155"]
        }
      ]
    }

    const res:AxiosResponse = await axios.post(axiosURL, 
      requestParams
    );

    for (const events of res.data.result.transfers) {
      if (events.erc1155Metadata == null) {
        let tokenId = parseInt(events.tokenId, 16);
        nftList.push({
          address: events.rawContract.address,
          tokenId: tokenId,
        });
      } else {
        for (const erc1155 of events.erc1155Metadata) {
          let tokenId = parseInt(erc1155.tokenId, 16);
          nftList.push({
            address: events.rawContract.address,
            tokenId: tokenId,
          });
        }
      }
  
    }
  }

  const getDetail = async () => {
    let temparray = [];
    for(let k=0; k< nftList.length; k++){
      const res:AxiosResponse = await axios.get(`https://api.opensea.io/asset/${nftList[k].address}/${nftList[k].tokenId}`);
      temparray.push(res.data)
      console.log(res.data.image_url);
      console.log(res.data.asset_contract.address);
    }
    setCollections(temparray);
    setLoadingNFT(false);
  };
  
  const extract = async () => {
    await run();
    await getDetail();
  };
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {!connector.connected && (
        <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
        </TouchableOpacity>
      )}
      {!!connector.connected && (
        <>
          <Text>{shortenAddress(connector.accounts[0])}</Text>
          <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Log out</Text>
          </TouchableOpacity>
          <ScrollView style={{width: '100%'}} contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
          {
            collections.map((item: any, i: any) => (
              <View key={i} style={styles.itemstyle}>
                <ImageBackground
                  resizeMode='contain'
                  source={{uri:item.image_url}}
                  style={styles.imgstyle}
                />
                <Text style={styles.addresss}>{item.asset_contract !== undefined ? item.asset_contract.address : ''}</Text>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            ))
          }
          </ScrollView>
        </>
      )}
      {/* { !active && <TouchableOpacity onPress={connect} style={styles.buttonStyle}>
        <Text style={styles.buttonTextStyle}>Connect a Wallet</Text>
      </TouchableOpacity>}
      {
        active && (
          <>
            <Text>{account}</Text>
            <TouchableOpacity onPress={disconnect} style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={extract} style={styles.buttonStyle}>
              <Text style={styles.buttonTextStyle}>View My NFTs</Text>
            </TouchableOpacity>
            <ScrollView style={{width: '100%'}} contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
            {
              collections.map((item: any, i: any) => (
                loadingNFT ? 
                <View style={styles.skeletonTheme} key={i}>
                  <SkeletonContent containerStyle={{ flex: 1, alignItems: 'center' }}
                    layout={[
                      { key: 'img', width: 280, height: 300, marginBottom: 6, margin: 'auto' },
                      { key: 'address', width: 280, height: 20, marginBottom: 6, margin: 'auto' },
                      { key: 'name', width: 280, height: 20, marginBottom: 6, margin: 'auto' },
                      { key: 'description', width: 280, height: 20, marginBottom: 6, margin: 'auto' }
                    ]} 
                    animationType="pulse"
                  />
                </View> :
                <View style={styles.itemstyle} key={i}>
                  <ImageBackground
                    resizeMode='contain'
                    source={{uri:item.image_url}}
                    style={styles.imgstyle}
                  />
                  <Text style={styles.addresss}>{item.asset_contract !== undefined ? item.asset_contract.address : ''}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              ))
            }
            </ScrollView>
          </>
        )
      } */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: "#3399FF",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  skeletonTheme: {
    flexDirection: 'column',
    height: 400,
    width: 350,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    margin: 5
  },
  itemstyle: {
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
    margin: 5
  },
  imgstyle: {
    width: 300,
    height: 350,
  },
  addresss: {
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    fontWeight: "600",
    width: 350,
  },
  name: {
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
    width: 350,
  },
  description: {
    color: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
    width: 350,
  }
});
