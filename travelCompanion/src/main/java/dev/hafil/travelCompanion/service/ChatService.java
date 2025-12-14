package dev.hafil.travelCompanion.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder){
        this.chatClient = chatClientBuilder.build();
    }

    public  String sayHello(){
        return chatClient.prompt("Say who your in 1 line").call().content();
    }
}
