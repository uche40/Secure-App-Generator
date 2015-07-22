/*

Martus(TM) is a trademark of Beneficent Technology, Inc. 
This software is (c) Copyright 2015, Beneficent Technology, Inc.

Martus is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either
version 2 of the License, or (at your option) any later
version with the additions and exceptions described in the
accompanying Martus license file entitled "license.txt".

It is distributed WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, including warranties of fitness of purpose or
merchantability.  See the accompanying Martus License and
GPL license for more details on the required license terms
for this software.

You should have received a copy of the GNU General Public
License along with this program; if not, write to the Free
Software Foundation, Inc., 59 Temple Place - Suite 330,
Boston, MA 02111-1307, USA.

*/

package org.benetech.secureapp.generator;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpSession;

import org.apache.commons.io.FileUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.AccessControlList;
import com.amazonaws.services.s3.model.GroupGrantee;
import com.amazonaws.services.s3.model.Permission;
import com.amazonaws.services.s3.model.PutObjectRequest;

@Controller
public class SummaryController extends WebMvcConfigurerAdapter
{
    public static final String VERSION_BUILD_XML = "versionBuild";
    public static final String VERSION_MINOR_XML = "versionMinor";
    public static final String VERSION_MAJOR_XML = "versionMajor";

	private static final String APP_NAME_XML = "appName";
	private static final String VERSION_SAG_BUILD_XML = "versionSagBuild";
    private static final String LOGO_NAME_PNG = "ic_launcher_secure_app.png";
	private static final String XML_DESKTOP_PUBLIC_KEY = "public_key_desktop";
	private static final String XML_MARTUS_SERVER_PUBLIC_KEY = "martus_server_public_key";
	private static final String XML_MARTUS_SERVER_IP = "martus_server_ip";
	private static final String XML_APP_NAME = "app_name";
	private static final String GRADLE_EXE = "/bin/gradle";
    private static final String GRADLE_PARAMETERS = " -p ";
	private static final String GRADLE_BUILD_COMMAND = " assembledebug";
	private static final String APK_LOCAL_FILE_DIRECTORY = "/build/outputs/apk/";
    private static final String APK_RESOURCE_FILE_LOCAL = "/res/values/non-traslatable-auto-generated-resources.xml";
    private static final String APK_HDPI_FILE_LOCAL = "/res/drawable-hdpi/";
    private static final String APK_MDPI_FILE_LOCAL = "/res/drawable-mdpi/";
    private static final String APK_NODPI_FILE_LOCAL = "/res/drawable-nodpi/";
    private static final String APK_XHDPI_FILE_LOCAL = "/res/drawable-xhdpi/";
    private static final String APK_XXHDPI_FILE_LOCAL = "/res/drawable-xxhdpi/";
    private static final String APK_XFORM_FILE_LOCAL = "/assets/xforms/sample.xml";
    private static final String SECURE_APP_PROJECT_DIRECTORY = "secure-app";
    private static final String GRADLE_GENERATED_SETTINGS_FILE = "generated.build.gradle";
    public static final String GRADLE_GENERATED_SETTINGS_LOCAL = SECURE_APP_PROJECT_DIRECTORY + "/" + GRADLE_GENERATED_SETTINGS_FILE;
    private static final int EXIT_VALUE_GRADLE_SUCCESS = 0;
	private static final String AMAZON_S3_DOWNLOAD_BUCKET_ENV = "S3_DOWNLOAD_BUCKET";
	private static final String AMAZON_S3_KEY_ENV = "AWS_KEY";
	private static final String AMAZON_S3_SECRET_ENV = "AWS_SECRET";
	private static final String AMAZON_S3_BASE_DIR = "https://s3.amazonaws.com/";
	@RequestMapping(value=WebPage.SUMMARY, method=RequestMethod.GET)
    public String directError(HttpSession session, Model model) 
    {
		SecureAppGeneratorApplication.setInvalidResults(session);
        return WebPage.ERROR;
    }

	@RequestMapping(value=WebPage.SUMMARY_PREVIOUS, method=RequestMethod.POST)
    public String goBack(HttpSession session, Model model, AppConfiguration appConfig) 
    {
		model.addAttribute(SessionAttributes.APP_CONFIG, appConfig);
       return WebPage.OBTAIN_CLIENT_TOKEN;
    }
	
	@RequestMapping(value=WebPage.SUMMARY_NEXT, method=RequestMethod.POST)	
	public String buildApk(HttpSession session, Model model, AppConfiguration appConfig) 
    {
		File secureAppBuildDir = null;
		try
		{
			createDownloadDirectoryIfItDoesntExist();
			secureAppBuildDir = configureSecureAppBuildDirectory(session);
			AppConfiguration config = (AppConfiguration)session.getAttribute(SessionAttributes.APP_CONFIG);
			updateApkSettings(secureAppBuildDir, config);
			updateGradleSettings(secureAppBuildDir, config);
			copyIconToApkBuild(secureAppBuildDir, config.getAppIconLocalFileLocation());
			copyFormToApkBuild(secureAppBuildDir, config.getAppXFormLocation());
			File apkCreated = buildApk(session, secureAppBuildDir, config);
			copyApkToDownloads(session, apkCreated, config);
			model.addAttribute(SessionAttributes.APP_CONFIG, config);
			return WebPage.FINAL;
		}
		catch (Exception e)
		{
			Logger.logException(session, e);
			appConfig.setApkBuildError("Error: Unable to generate APK.");
			model.addAttribute(SessionAttributes.APP_CONFIG, appConfig);
			return WebPage.SUMMARY;
		}
		finally
		{
	//		try
			{
	//			TODO: add this back once tested on server.			
	//			if(secureAppBuildDir != null)
	//				FileUtils.deleteDirectory(secureAppBuildDir);
			}
	//		catch (IOException e)
			{
	//			Logger.logException(e);			
			}			
		}
    }

	private File configureSecureAppBuildDirectory(HttpSession session) throws IOException
	{
		File baseBuildDir = getSessionBuildDirectory();
		copyDefaultBuildFilesToStagingArea(session, baseBuildDir);
		return new File(baseBuildDir, SECURE_APP_PROJECT_DIRECTORY);
	}

	private void copyFormToApkBuild(File baseBuildDir, String appXFormLocation) throws IOException
	{
		File source = new File(SecureAppGeneratorApplication.getStaticWebDirectory(), appXFormLocation);
		File destination = new File(baseBuildDir, APK_XFORM_FILE_LOCAL);
		FileUtils.copyFile(source, destination);
	}

	private void copyIconToApkBuild(File baseBuildDir, String appIconLocation) throws IOException
	{
		//TODO adjust resolution
		File source = new File(appIconLocation);
		File destination = new File(baseBuildDir, APK_NODPI_FILE_LOCAL + LOGO_NAME_PNG);
		FileUtils.copyFile(source, destination);
		destination = new File(baseBuildDir, APK_MDPI_FILE_LOCAL + LOGO_NAME_PNG);
		FileUtils.copyFile(source, destination);
		destination = new File(baseBuildDir, APK_HDPI_FILE_LOCAL + LOGO_NAME_PNG);
		FileUtils.copyFile(source, destination);
		destination = new File(baseBuildDir, APK_XHDPI_FILE_LOCAL + LOGO_NAME_PNG);
		FileUtils.copyFile(source, destination);
		destination = new File(baseBuildDir, APK_XXHDPI_FILE_LOCAL + LOGO_NAME_PNG);
		FileUtils.copyFile(source, destination);
	}

	private void updateGradleSettings(File baseBuildDir, AppConfiguration config) throws IOException
	{
		StringBuilder data = new StringBuilder("");
		appendGradleValue(data, VERSION_MAJOR_XML, config.getApkVersionMajor());
		appendGradleValue(data, VERSION_MINOR_XML, config.getApkVersionMinor());
		appendGradleValue(data, VERSION_BUILD_XML, config.getApkVersionBuild());
		appendGradleValue(data, VERSION_SAG_BUILD_XML, config.getApkSagVersionBuild());
		appendGradleValue(data, APP_NAME_XML, config.getAppName());

		File apkResourseFile = new File(baseBuildDir, GRADLE_GENERATED_SETTINGS_FILE);
  		FileOutputStream fileOutputStream = new FileOutputStream(apkResourseFile);
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(fileOutputStream,"UTF-8"));       
   		writer.write(data.toString());
   		writer.flush();
   		writer.close();
 	}
		
	private void updateApkSettings(File baseBuildDir, AppConfiguration config) throws IOException
	{
		StringBuilder data = new StringBuilder("<?xml version=\"1.0\" encoding=\"utf-8\"?>\n");
		data.append("<resources>\n");
		appendKeyValue(data, XML_APP_NAME, config.getAppName());
		appendKeyValue(data, XML_MARTUS_SERVER_IP, config.getServerIP());
		appendKeyValue(data, XML_MARTUS_SERVER_PUBLIC_KEY, config.getServerPublicKey());
		appendKeyValue(data, XML_DESKTOP_PUBLIC_KEY, config.getClientPublicKey());
		data.append("</resources>\n");

		File apkResourseFile = new File(baseBuildDir, APK_RESOURCE_FILE_LOCAL);
  		FileOutputStream fileOutputStream = new FileOutputStream(apkResourseFile);
		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(fileOutputStream,"UTF-8"));       
   		writer.write(data.toString());
   		writer.flush();
   		writer.close();
 	}

	private void appendKeyValue(StringBuilder data, String key, String value)
	{
		data.append("<string name=\"");
		data.append(key);
		data.append("\">");
		data.append(value);
		data.append("</string>\n");
	}

	private void appendGradleValue(StringBuilder data, String key, String value)
	{
		data.append("project.ext.set(\"");
		data.append(key);
		data.append("\", \"");
		data.append(value);
		data.append("\")\n");
	}

	private File buildApk(HttpSession session, File baseBuildDir, AppConfiguration config) throws IOException, InterruptedException
	{
		Logger.log(session, "Building " + config.getApkName());
		Runtime rt = Runtime.getRuntime();
   		String gradleCommand = SecureAppGeneratorApplication.getGadleDirectory() + GRADLE_EXE + GRADLE_PARAMETERS + baseBuildDir + GRADLE_BUILD_COMMAND;
   		Logger.log(session, gradleCommand);
		long startTime = System.currentTimeMillis();
 
		String line;
		Logger.logVerbose(session, "Starting exec");
		Process p = rt.exec(gradleCommand);
		Logger.logVerbose(session, "Displaying output from exec.");
		BufferedReader input = new BufferedReader(new InputStreamReader(p.getInputStream()));
		while ((line = input.readLine()) != null) 
		{
			Logger.logVerbose(session, line);
		}
		Logger.logVerbose(session, "Finished exec output.");
		input.close();		
    		p.waitFor();
  		long endTime = System.currentTimeMillis();
   		long buildTime = endTime-startTime;
   		String timeToBuild = String.format("%02d:%02d", 
   			    TimeUnit.MILLISECONDS.toMinutes(buildTime) - 
   			    TimeUnit.HOURS.toMinutes(TimeUnit.MILLISECONDS.toHours(buildTime)),
   			    TimeUnit.MILLISECONDS.toSeconds(buildTime) - 
   			    TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(buildTime)));

   		int returnCode = p.exitValue();
   		if(returnCode == EXIT_VALUE_GRADLE_SUCCESS)
   		{
   			Logger.log(session, "Build succeeded:" + timeToBuild);
    		}
   		else
   		{
   			Logger.logError(session, "Build return code:" + returnCode);
	   		throw new IOException("Error creating APK");
   		}
   		String tempApkBuildFileDirectory = baseBuildDir.getAbsolutePath() + APK_LOCAL_FILE_DIRECTORY;
		File appFileCreated = new File(tempApkBuildFileDirectory, config.getGradleApkRawBuildFileName());
		return appFileCreated;
	}

	public void copyApkToDownloads(HttpSession session, File apkFileToMove, AppConfiguration config) throws IOException
	{
		File finalFile = new File(apkFileToMove.getParent(), config.getApkName());
		FileUtils.moveFile(apkFileToMove, finalFile);
		uploadToAmazonS3(session, finalFile);
		config.setApkURL(getApkUrl(session, finalFile));
	}
	
	private void uploadToAmazonS3(HttpSession session, File fileToUpload)
	{
        AmazonS3 s3client = new AmazonS3Client(new BasicAWSCredentials(getAwsKey(), getAwsSecret()));
		String bucketName = getDownloadS3Bucket();
		Logger.logVerbose(session, "S3BucketName = " + bucketName);
		if(!s3client.doesBucketExist(bucketName))
			Logger.logError(session, "Does not exist?  S3 Bucket :" + bucketName);

		AccessControlList acl = new AccessControlList();
		acl.grantPermission(GroupGrantee.AllUsers, Permission.Read);
		s3client.putObject(new PutObjectRequest(bucketName, getAPKDownloadFilePath(fileToUpload),  fileToUpload).withAccessControlList(acl));
	}

	private String getAPKDownloadFilePath(File fileToUpload)
	{
		return SecureAppGeneratorApplication.APK_DOWNLOADS_DIRECTORY + "/" + fileToUpload.getName();
	}

	private String getApkUrl(HttpSession session, File file)
	{
		String apkURL = AMAZON_S3_BASE_DIR + getDownloadS3Bucket() + "/" + getAPKDownloadFilePath(file);
		Logger.log(session, "APK URL = " + apkURL);
		return apkURL;
	}

	private String getAwsSecret()
	{
 		return System.getenv(AMAZON_S3_SECRET_ENV);
	}

	private String getAwsKey()
	{
 		return System.getenv(AMAZON_S3_KEY_ENV);
	}

	private String getDownloadS3Bucket()
	{
  		return System.getenv(AMAZON_S3_DOWNLOAD_BUCKET_ENV);
	}

	private void copyDefaultBuildFilesToStagingArea(HttpSession session, File baseBuildDir) throws IOException
	{
		File source = new File(SecureAppGeneratorApplication.getOriginalBuildDirectory());
		Logger.log(session, "Copying Build directory, from:" + source.getAbsolutePath() + " to: "+ baseBuildDir.getAbsolutePath());
		FileUtils.copyDirectory(source, baseBuildDir);
	}

	public File getSessionBuildDirectory() throws IOException
	{
		File baseBuildDir = getRandomDirectoryFile();
		return baseBuildDir;
	}

	private void createDownloadDirectoryIfItDoesntExist() throws IOException
	{
		File downloadsDirectory = new File(SecureAppGeneratorApplication.getDownloadsDirectory());
		if(!downloadsDirectory.exists())
			if(!downloadsDirectory.mkdir())
				throw new IOException("Unable to create downloads directory:" + downloadsDirectory.getAbsolutePath());
	}
	
	public static File getRandomDirectoryFile() throws IOException
	{
	    final File tempDir;
	    tempDir = File.createTempFile("build", Long.toString(System.nanoTime()));
	    tempDir.delete();
	    tempDir.mkdirs();
	    return tempDir;
	}	
}
