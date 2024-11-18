package com.groupd.bms.config;

import com.bugsnag.BugsnagSpringConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import com.bugsnag.Bugsnag;


@Configuration
@Import(BugsnagSpringConfiguration.class)
public class BugsnagConfig {
    @Bean
    public Bugsnag bugsnag() {
        return new Bugsnag("3947089b6134ec6ff27e25f3bff4bcad");
    }
}