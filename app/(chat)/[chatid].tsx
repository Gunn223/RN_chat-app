import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Doc } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
const Page = () => {
  const { chatid } = useLocalSearchParams();
  const [user, setUser] = useState<string | null>(null);
  const convex = useConvex();
  const navigation = useNavigation();
  const [newMessage, setNewmessage] = useState('');
  const addMessage = useMutation(api.messages.sendMessage);
  const messages = useQuery(api.messages.get, { chatId: chatid as Id<'groups'> }) || [];
  const listRef = useRef<FlatList>(null);
  const [selectedImage, SetselectedaImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    const loadGroup = async () => {
      const groupInfo = await convex.query(api.group.getGroup, { id: chatid as Id<'groups'> });
      navigation.setOptions({ headerTitle: groupInfo?.name });
    };
    loadGroup();
  }, [chatid]);
  // load user
  useEffect(() => {
    const loaduser = async () => {
      const user = await AsyncStorage.getItem('user');
      setUser(user);
    };
    loaduser();
  }, []);
  const handleSendMessage = async () => {
    Keyboard.dismiss();

    if (selectedImage) {
      setUploading(true);
      const url = `${process.env.EXPO_PUBLIC_CONVEX_SITE}/sendImage?user=${encodeURIComponent(
        user!,
      )}&group_id=${chatid}&content=${encodeURIComponent(newMessage)}`;

      const response = await fetch(selectedImage);
      const blob = await response.blob();

      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': blob.type! },
        body: blob,
      })
        .then(() => {
          SetselectedaImage(null);
          setNewmessage('');
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => setUploading(false));
    } else {
      addMessage({
        group_id: chatid as Id<'groups'>,
        content: newMessage,
        user: user || ' anon',
      });
    }
  };
  const Captureimage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      SetselectedaImage(uri);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, [messages]);
  const rendererMessage: ListRenderItem<Doc<'messages'>> = ({ item }) => {
    const isUMessage = item.user === user;

    return (
      <View style={(styles.messagecontainer, isUMessage ? styles.userMessageContainer : styles.OtherMessagecontainer)}>
        {item.content != '' && (
          <Text style={(styles.messageText, isUMessage ? styles.messageText : null)}>{item.content}</Text>
        )}
        {item.file && (
          <Image
            source={{ uri: item.file }}
            style={{ width: 200, height: 200, margin: 10 }}
          />
        )}
        <Text style={styles.timestap}>
          {new Date(item._creationTime).toLocaleDateString()} - {item.user}
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* {there wilbe dargon} */}
        <FlatList
          ref={listRef}
          ListFooterComponent={<View style={{ padding: 10 }}></View>}
          data={messages}
          renderItem={rendererMessage}
          keyExtractor={(item) => item._id.toString()}
        />
        {/* {buuton input } */}
        <View style={styles.inputContainer}>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: 200, height: 200, margin: 10 }}
            />
          )}
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.Textinput}
              onChangeText={setNewmessage}
              value={newMessage}
              placeholder="Type Your Message"
              multiline={true}></TextInput>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={newMessage === ''}>
              <Ionicons
                name="send-outline"
                style={styles.sendButtonText}></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={Captureimage}
              disabled={newMessage === ''}>
              <Ionicons
                name="send-outline"
                style={styles.sendButtonText}></Ionicons>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {uploading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}>
          <ActivityIndicator
            color={'white'}
            animating
            size="large"></ActivityIndicator>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4F1FF',
  },
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  Textinput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 6,
    minHeight: 40,
    paddingTop: 10,
  },
  sendButton: {
    backgroundColor: '#EEA217',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    alignSelf: 'flex-end',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  messagecontainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#A2C579',
  },
  OtherMessagecontainer: {
    alignSelf: 'flex-start',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: '#E5D283',
  },
  messageText: {
    fontSize: 16,
    flexWrap: 'wrap',
    color: '#040D12',
  },
  messageTextOtheruser: {
    fontSize: 16,
    flexWrap: 'wrap',
    color: '#040D12',
  },
  timestap: {
    fontSize: 10,
    color: 'gray',
  },
});
