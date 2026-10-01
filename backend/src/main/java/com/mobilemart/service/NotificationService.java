package com.mobilemart.service;

import com.mobilemart.model.Notification;
import com.mobilemart.model.User;
import com.mobilemart.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    public Notification createNotification(User user, String title, String message, String type, String linkUrl) {
        Notification notification = new Notification(user, title, message, type, linkUrl);
        Notification saved = notificationRepository.save(notification);

        // Try sending via WebSocket if available
        if (messagingTemplate != null && user != null) {
            try {
                messagingTemplate.convertAndSendToUser(user.getEmail(), "/queue/notifications", saved);
            } catch (Exception ignored) {}
        }

        return saved;
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadUserNotifications(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    public void markAllAsRead(User user) {
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        for (Notification n : unread) {
            n.setIsRead(true);
            notificationRepository.save(n);
        }
    }
}
